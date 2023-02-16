type Props = {
  children: React.ReactNode;
};
export function DrawerContainer({ children }: Props) {
  return (
    <div className="drawer bg-orange-100 drawer-end">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      {children}
    </div>
  );
}
