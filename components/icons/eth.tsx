interface IconProps {
  width?: string;
  height?: string;
  className?: string;
}

export const EthIcon = ({ height = "24px", className }: IconProps) => {
  return (
    <svg className={className} fill="none" height={height} viewBox="0 0 24 24">
      <title>Eth Icon</title>

      <g className="fill-current" fill="currentColor" fillRule="nonzero">
        <path d="m12 16.576 7.498-4.353L12 8.873zM4.5 12.223l7.5 4.353V8.874zM12 0v8.872l7.498 3.35z" />
        <path d="M12 0 4.5 12.223 12 8.872zM12 17.972V24l7.503-10.381zM12 24v-6.03L4.5 13.62z" />
      </g>
    </svg>
  );
};
