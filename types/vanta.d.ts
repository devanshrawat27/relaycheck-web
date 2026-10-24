declare module 'vanta/dist/vanta.fog.min' {
  interface VantaEffect {
    destroy: () => void;
    setOptions?: (options: Record<string, unknown>) => void;
    resize?: () => void;
  }

  interface VantaOptions {
    el: HTMLElement;
    THREE?: unknown;
    [key: string]: unknown;
  }

  const FOG: (options: VantaOptions) => VantaEffect;
  export default FOG;
}
