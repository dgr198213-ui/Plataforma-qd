// connectors/GitHubConnector.jsx
import { Octokit } from '@octokit/rest';
import { BaseConnector } from '../types/connector.interface';

export class GitHubConnector extends BaseConnector {
  constructor(config) {
    super({ ...config, type: 'github' });
    this.octokit = null;
    this.currentRepo = null;
  }

  async connect() {
    try {
      this.octokit = new Octokit({
        auth: this.credentials.token
      });

      // Test de conexión
      const { data } = await this.octokit.users.getAuthenticated();
      this.isActive = true;

      return {
        success: true,
        user: data.login,
        name: data.name
      };
    } catch (error) {
      this.isActive = false;
      throw new Error(`GitHub: ${error.message}`);
    }
  }

  async listRepositories() {
    if (!this.isActive) throw new Error('Not connected');

    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 50
    });

    return data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      defaultBranch: repo.default_branch
    }));
  }

  async cloneRepository(repoFullName) {
    if (!this.isActive) await this.connect();

    const [owner, repo] = repoFullName.split('/');

    // Obtener estructura del repo (recursivo)
    const { data: tree } = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: 'HEAD',
      recursive: true
    });

    // Descargar archivos
    const files = [];
    for (const item of tree.tree) {
      if (item.type === 'blob') {
        const { data } = await this.octokit.git.getBlob({
          owner,
          repo,
          file_sha: item.sha
        });

        // Decodificar base64 a UTF-8 sin usar Buffer de Node.js
        const content = this._decodeBase64(data.content);

        files.push({
          path: item.path,
          content: content
        });
      }
    }

    this.currentRepo = { owner, repo };
    return files;
  }

  async pushChanges(files, commitMessage) {
    if (!this.currentRepo) throw new Error('No repository selected');
    if (!this.isActive) await this.connect();

    const { owner, repo } = this.currentRepo;

    // 1. Obtener el SHA del último commit de la rama principal
    const { data: ref } = await this.octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });
    const latestCommitSha = ref.object.sha;

    // 2. Crear blobs para cada archivo
    const tree = [];
    for (const file of files) {
      const { data: blob } = await this.octokit.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: 'utf-8'
      });

      tree.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
    }

    // 3. Crear un nuevo tree
    const { data: newTree } = await this.octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: latestCommitSha
    });

    // 4. Crear el commit
    const { data: newCommit } = await this.octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSha]
    });

    // 5. Actualizar la referencia
    await this.octokit.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: newCommit.sha
    });

    return { commitSha: newCommit.sha };
  }

  _decodeBase64(base64) {
    try {
      // Reemplazar saltos de línea que a veces vienen en el base64 de GitHub
      const cleanBase64 = base64.replace(/\s/g, '');
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch (e) {
      console.error('Error decodificando base64:', e);
      return '';
    }
  }
}
