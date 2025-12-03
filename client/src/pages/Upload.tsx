import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

export default function Upload() {
	const auth = useAuth();
	const navigate = useNavigate();
	const flash = useFlash();
	const [uploading, setUploading] = createSignal(false);
	const [dragOver, setDragOver] = createSignal(false);
	const [fileName, setFileName] = createSignal("");

	if (!auth.isAdmin() && !auth.loading()) {
		flash.setFlash("Must be admin!", "error");
		navigate("/", { replace: true });
		return <></>;
	}

	async function handleUpload(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		setUploading(true);
		const res = await fetch("/api/files/upload", {
			method: "POST",
			body: formData,
		});
		setUploading(false);

		flash.setFlash(
			res.ok ? "Uploaded successfully!" : "Upload failed",
			res.ok ? "success" : "error"
		);

		if (res.ok) {
			setFileName("");
			(e.target as HTMLFormElement).reset();
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			setFileName(input.files[0].name);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		setDragOver(true);
	}

	function handleDragLeave() {
		setDragOver(false);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		setDragOver(false);
		const input = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		if (e.dataTransfer?.files && input) {
			input.files = e.dataTransfer.files;
			setFileName(e.dataTransfer.files[0]?.name || "");
		}
	}

	return (
		<div class="page-container">
			<div class="upload-container">
				<h1 class="upload-title">Upload File</h1>
				<p class="upload-subtitle">
					Upload images for the menu or gallery
				</p>

				<form onSubmit={handleUpload} class="upload-form">
					<div
						class={`upload-dropzone ${
							dragOver() ? "dragover" : ""
						} ${fileName() ? "has-file" : ""}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						<input
							type="file"
							name="file"
							id="file-input"
							required
							onChange={handleFileChange}
							class="file-input"
						/>
						<label for="file-input" class="dropzone-content">
							<div class="upload-icon">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="17 8 12 3 7 8" />
									<line x1="12" y1="3" x2="12" y2="15" />
								</svg>
							</div>
							<p class="dropzone-text">
								{fileName()
									? fileName()
									: "Drag & drop a file here, or click to select"}
							</p>
							<p class="dropzone-hint">
								Supports images, PDFs, and documents
							</p>
						</label>
					</div>

					<button
						type="submit"
						class="btn btn-primary upload-btn"
						disabled={uploading()}
					>
						{uploading() ? "Uploading..." : "Upload File"}
					</button>
				</form>
			</div>
		</div>
	);
}
