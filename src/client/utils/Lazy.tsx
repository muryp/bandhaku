import Loading from "../components/Loading/Routes";
import loadable from "@loadable/component";

export const Lazy = ({ component }: { component: () => Promise<any> }) => {
  const Loadable = loadable(component, {
    fallback: <Loading />,
  });
  return <Loadable />;
};
