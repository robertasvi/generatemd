import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { GeneratedFile } from './generator';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  async download(file: GeneratedFile, body: string): Promise<void> {
    if (file.folder) {
      const zip = new JSZip();
      zip.file(`${file.folder}/SKILL.md`, body);
      const blob = await zip.generateAsync({ type: 'blob' });
      this.save(blob, `${file.folder}.zip`);
      return;
    }

    this.save(new Blob([body], { type: 'text/markdown' }), file.path.split('/').pop() ?? file.path);
  }

  private save(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}