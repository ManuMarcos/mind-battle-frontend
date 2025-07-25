type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return <img src="/logo.png" className={`h-auto ${className}`} />;
};
