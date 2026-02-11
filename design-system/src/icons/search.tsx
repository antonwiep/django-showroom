export const IconSearch = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.33"
      />
      <path
        d="M20 20L16.05 16.05"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.33"
      />
    </svg>
  );
};
