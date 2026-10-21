import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { API_DOCS_LIST, ApiEndpointDoc } from '../../shared/models/api-doc.model';

@Component({
  selector: 'app-api-docs-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">REST v1</span>
            <h3 class="font-bold text-slate-900 text-sm">Dokumentasi RESTful API Komunitas</h3>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Spesifikasi OpenAPI/REST untuk integrasi aplikasi pihak ketiga, event, dan webhook.</p>
        </div>
        <div class="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          @for (cat of categories; track cat) {
            <button
              type="button"
              (click)="selectedCategory.set(cat)"
              [class]="selectedCategory() === cat ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'"
              class="px-2.5 py-1 rounded-lg transition-all"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Endpoints List -->
      <div class="space-y-3">
        @for (ep of filteredEndpoints(); track ep.path + ep.method) {
          <div class="rounded-xl border border-slate-200/90 overflow-hidden bg-slate-50/50">
            <div class="p-3 flex items-center justify-between gap-3 bg-white border-b border-slate-100">
              <div class="flex items-center gap-2 font-mono text-xs">
                <span
                  [class]="ep.method === 'GET' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'"
                  class="px-2 py-0.5 rounded-md font-bold text-[10px]"
                >
                  {{ ep.method }}
                </span>
                <span class="font-semibold text-slate-900">{{ ep.path }}</span>
              </div>
              <div class="flex items-center gap-2">
                @if (ep.authRequired) {
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Bearer Token
                  </span>
                } @else {
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Publik
                  </span>
                }
              </div>
            </div>
            <div class="p-3 text-xs text-slate-600 space-y-2">
              <p>{{ ep.description }}</p>
              @if (ep.sampleRequest) {
                <div>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Payload Permintaan:</span>
                  <pre class="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto mt-1">{{ ep.sampleRequest }}</pre>
                </div>
              }
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Contoh Respon HTTP 200:</span>
                <pre class="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto mt-1">{{ ep.sampleResponse }}</pre>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ApiDocsPanelComponent {
  categories = ['Semua', 'Members', 'Events', 'Finance'];
  selectedCategory = signal<string>('Semua');
  endpoints = API_DOCS_LIST;

  filteredEndpoints(): ApiEndpointDoc[] {
    const cat = this.selectedCategory();
    if (cat === 'Semua') return this.endpoints;
    return this.endpoints.filter(e => e.category === cat);
  }
}
