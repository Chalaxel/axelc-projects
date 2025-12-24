import bodyStyles from './Body.module.css';

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <div className={bodyStyles.root}>{children}</div>;
};
