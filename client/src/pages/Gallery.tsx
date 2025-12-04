import { createSignal, onMount, For, Show } from "solid-js";

export default function Gallery() {
  const [files, setFiles] = createSignal<string[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [selectedImage, setSelectedImage] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const res = await fetch("/api/files/list");
      if (res.ok) {
        const allFiles = await res.json();
        // Filter to only show image files
        const imageFiles = allFiles.filter((file: string) =>
          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
        );
        setFiles(imageFiles);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  });

  function openLightbox(file: string) {
    setSelectedImage(file);
  }

  function closeLightbox() {
    setSelectedImage(null);
  }

  return (
    <div class="page-container">
      <div class="gallery-header">
        <h1 class="gallery-title">Our Gallery</h1>
        <p class="gallery-subtitle">A glimpse into the La Maison Dorée experience</p>
      </div>

      <Show when={loading()}>
        <div class="gallery-loading">
          <p>Loading gallery...</p>
        </div>
      </Show>

      <Show when={!loading() && files().length === 0}>
        <div class="gallery-empty">
          <div class="empty-icon">📷</div>
          <p>No images in the gallery yet</p>
        </div>
      </Show>

      <Show when={!loading() && files().length > 0}>
        <div class="gallery-grid">
          <For each={files()}>
            {(file) => (
              <div class="gallery-item" onClick={() => openLightbox(file)}>
                <img src={`/api/uploads/${file}`} alt={file} class="gallery-image" loading="lazy" />
                <div class="gallery-overlay">
                  <span class="gallery-filename">{file}</span>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Lightbox */}
      <Show when={selectedImage()}>
        <div class="lightbox" onClick={closeLightbox}>
          <button class="lightbox-close" onClick={closeLightbox} aria-label="Close">
            ✕
          </button>
          <img
            src={`/api/uploads/${selectedImage()}`}
            alt={selectedImage() || ""}
            class="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </Show>
    </div>
  );
}
