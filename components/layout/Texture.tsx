/* Site-wide texture: animated film grain, a dark-mode vignette, and a
   light-mode paper tooth. Each layer's strength is set per theme in tokens,
   so inactive layers simply fade to zero. */
export default function Texture() {
  return (
    <>
      <div className="tex-layer tex-vignette" aria-hidden />
      <div className="tex-layer tex-paper" aria-hidden />
      <div className="tex-layer tex-grain" aria-hidden />
    </>
  );
}
