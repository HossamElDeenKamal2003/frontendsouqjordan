<template>
  <div class="image-upload-container" :class="{ 'dark-mode': isDark }">
    <!-- Card-like button -->
    <div class="image-card" @click="showBottomSheet">
      <div class="card-content">
        <i :class="images.length ? 'fas fa-edit' : 'fas fa-image'" class="card-icon"></i>
        <span class="card-text">{{ images.length ? 'Edit' : 'Add Image' }}</span>
      </div>
    </div>

    <!-- Bottom Sheet (No Overlay) -->
    <transition name="slide-up">
      <div v-if="isBottomSheetOpen" class="bottom-sheet">
        <div class="bottom-sheet-content">
          <div class="sheet-item" @click="openCamera">
            <i class="fas fa-camera sheet-icon"></i>
            <span>Take Photo</span>
          </div>
          <div class="sheet-item">
            <label class="gallery-label">
              <i class="fas fa-photo-film sheet-icon"></i>
              <span>Choose from Gallery</span>
              <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleFileUpload"
                  :disabled="images.length >= 7"
                  hidden
              />
            </label>
          </div>
        </div>
      </div>
    </transition>

    <!-- Image Previews -->
    <div class="image-previews" v-if="images.length">
      <div v-for="(image, index) in images" :key="index" class="image-preview">
        <img :src="image.url" alt="Preview" />
        <button class="delete-btn" @click="deleteImage(index)" aria-label="Delete image">×</button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="error-message" aria-live="polite">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    isDark: {
      type: Boolean,
      default: false,
    },
    initialImages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      images: [], // Array of { file: File, url: string }
      isBottomSheetOpen: false,
      videoStream: null,
      error: '',
    };
  },
  watch: {
    images: {
      handler(newImages) {
        // Emit only the File objects to the parent component
        this.$emit('update:images', newImages.map(img => img.file));
      },
      deep: true,
    },
  },
  methods: {
    showBottomSheet() {
      if (this.images.length >= 7) {
        this.error = 'Maximum of 7 images reached.';
        return;
      }
      this.isBottomSheetOpen = true;
    },
    closeBottomSheet() {
      this.isBottomSheetOpen = false;
    },
    async handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (this.images.length + files.length > 7) {
        this.error = 'You can upload a maximum of 7 images.';
        this.closeBottomSheet();
        return;
      }
      this.error = '';

      for (const file of files) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
          this.error = `File "${file.name}" is not a supported image type. Only JPEG, PNG, GIF, and WebP are allowed.`;
          continue;
        }
        try {
          const resizedFile = await this.resizeImage(file);
          const url = URL.createObjectURL(resizedFile);
          this.images.push({ file: resizedFile, url });
        } catch (err) {
          this.error = `Failed to process image "${file.name}". Please try another file.`;
          console.error('Image processing error:', err);
        }
      }
      this.closeBottomSheet();
    },
    async resizeImage(file) {
      const maxSize = 1024;
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      return new Promise((resolve, reject) => {
        img.onload = () => {
          let { width, height } = img;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
              blob => {
                if (!blob) {
                  reject(new Error('Failed to create blob from canvas'));
                  return;
                }
                const resizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(resizedFile);
              },
              'image/jpeg',
              0.8
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
      });
    },
    async openCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.error = 'Camera access is not supported on this device or browser.';
        this.closeBottomSheet();
        return;
      }
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        this.error = 'Camera access requires a secure connection (HTTPS).';
        this.closeBottomSheet();
        return;
      }
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        // Create a temporary video element to capture the image
        const video = document.createElement('video');
        video.srcObject = this.videoStream;
        video.play();
        // Wait for the video to be ready
        await new Promise(resolve => {
          video.onloadedmetadata = resolve;
        });
        // Capture immediately
        await this.capturePhoto(video);
      } catch (err) {
        this.error = 'Failed to access camera. Please ensure camera permissions are granted.';
        console.error('Camera access error:', err);
        this.closeBottomSheet();
      }
    },
    async capturePhoto(video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      canvas.toBlob(
          async blob => {
            if (!blob) {
              this.error = 'Failed to capture photo.';
              this.closeCamera();
              return;
            }
            const file = new File([blob], `photo_${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            try {
              const resizedFile = await this.resizeImage(file);
              const url = URL.createObjectURL(resizedFile);
              if (this.images.length < 7) {
                this.images.push({ file: resizedFile, url });
              } else {
                this.error = 'Maximum of 7 images reached.';
              }
              this.closeCamera();
              this.closeBottomSheet();
            } catch (err) {
              this.error = 'Failed to process captured photo.';
              console.error('Photo processing error:', err);
              this.closeCamera();
              this.closeBottomSheet();
            }
          },
          'image/jpeg',
          0.8
      );
    },
    closeCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }
    },
    deleteImage(index) {
      URL.revokeObjectURL(this.images[index].url);
      this.images.splice(index, 1);
      this.error = '';
    },
  },
  beforeUnmount() {
    this.closeCamera();
    this.images.forEach(img => URL.revokeObjectURL(img.url));
  },
};
</script>

<style scoped>
/* Color variables to match Flutter AppColors */
:root {
  --primary-color: #4CAF50;
  --white-color: #FFFFFF;
  --dark-primary-color: #2D2D2D;
  --error-color: #F44336;
}

/* Container */
.image-upload-container {
  margin-bottom: 12px; /* 12sp */
}

/* Card-like button */
.image-card {
  width: 20vw; /* 20% of viewport width */
  height: 10vh; /* 10% of viewport height */
  margin: 3px; /* 3sp */
  padding: 8px; /* 8sp */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px; /* 2sp */
  background-color: var(--white-color);
  border: 1px solid var(--primary-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dark-mode .image-card {
  background-color: var(--dark-primary-color);
  border-color: var(--white-color);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* ~4sp */
}

.card-icon {
  font-size: 20px; /* 20sp */
  color: var(--primary-color);
}

.dark-mode .card-icon {
  color: var(--white-color);
}

.card-text {
  font-size: 8px; /* 8sp */
  font-weight: bold;
  color: var(--primary-color);
}

.dark-mode .card-text {
  color: var(--white-color);
}

/* Bottom Sheet */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  //background-color: var(--white-color);
  background-color: darkgrey;
  border-radius: 16px 16px 0 0; /* 16sp */
  padding: 12px; /* 12sp */
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.dark-mode .bottom-sheet {
  background-color: var(--dark-primary-color);
}

.bottom-sheet-content {
  display: flex;
  flex-direction: column;
  gap: 8px; /* ~8sp */
}

.sheet-item {
  display: flex;
  align-items: center;
  padding: 12px; /* 12sp */
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.sheet-item:hover {
  background-color: #f0f0f0;
}

.dark-mode .sheet-item:hover {
  background-color: #3a3a3a;
}

.sheet-icon {
  font-size: 20px; /* ~20sp */
  color: var(--primary-color);
  margin-right: 12px; /* 12sp */
}

.dark-mode .sheet-icon {
  color: var(--white-color);
}

.sheet-item span {
  font-size: 14px; /* 14sp */
  color: #333;
}

.dark-mode .sheet-item span {
  color: var(--white-color);
}

.gallery-label {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Image Previews */
.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* 8sp */
  margin-top: 8px; /* 8sp */
}

.image-preview {
  position: relative;
  width: 60px; /* Compact size */
  height: 60px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px; /* 2sp */
  border: 1px solid #ddd;
}

.dark-mode .image-preview img {
  border-color: #555;
}

.delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background-color: var(--error-color);
  color: red;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* Error Message */
.error-message {
  color: var(--error-color);
  font-size: 12px; /* ~12sp */
  margin-top: 8px; /* 8sp */
}

.dark-mode .error-message {
  color: #EF5350;
}

/* Bottom Sheet Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .image-card {
    width: 30vw;
    height: 15vh;
  }

  .image-preview {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .image-card {
    width: 40vw;
    height: 20vh;
  }

  .image-preview {
    width: 40px;
    height: 40px;
  }

  .card-icon {
    font-size: 16px;
  }

  .card-text {
    font-size: 7px;
  }
}
</style>