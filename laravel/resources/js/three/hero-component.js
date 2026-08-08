/**
 * Alpine.js data component for the Synova 3D enterprise hero scene.
 *
 * Registered in app.js via Alpine.data('synovaThreeHero', ...)
 * Used in Blade with: x-data="synovaThreeHero" x-init="initThree"
 */
export default function synovaThreeHero() {
  return {
    scene: null,
    loading: true,
    hasWebGL: true,
    isMobile: false,
    _destroyed: false,

    initThree() {
      this.isMobile = window.innerWidth < 640;

      // Check WebGL availability
      try {
        const c = document.createElement('canvas');
        this.hasWebGL = !!(c.getContext('webgl') || c.getContext('webgl2'));
      } catch {
        this.hasWebGL = false;
      }

      if (!this.hasWebGL || this.isMobile) {
        this.loading = false;
        return;
      }

      // Defer to next tick so $refs are available
      this.$nextTick(async () => {
        if (this._destroyed) return;
        const canvas = this.$refs.canvas;
        if (!canvas) {
          this.loading = false;
          return;
        }

        try {
          const { createEnterpriseScene } = await import(
            /* webpackChunkName: "three-scene" */ './enterprise-scene'
          );
          if (this._destroyed) {
            // Component was torn down while the chunk was loading —
            // never create a scene that would be orphaned.
            this.loading = false;
            return;
          }
          this.scene = createEnterpriseScene(canvas);
        } catch (err) {
          console.error('[Synova 3D] Failed to load enterprise scene:', err);
        } finally {
          this.loading = false;
        }
      });
    },

    destroy() {
      this._destroyed = true;
      this.scene?.destroy();
      this.scene = null;
    },
  };
}