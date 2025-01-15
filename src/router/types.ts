import { ReactNode, ComponentType, LazyExoticComponent } from "react";

export interface LayoutProps {
  children: ReactNode;
}

export interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType<unknown>> | null;
  layout?: ComponentType<LayoutProps>;
  children?: RouteConfig[];
}

export type PageModule = () => Promise<{
  default: ComponentType<unknown>;
}>;

export interface LayoutModule {
  default: ComponentType<LayoutProps>;
}
