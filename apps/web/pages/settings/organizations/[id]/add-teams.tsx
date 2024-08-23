"use client";

import { getServerSideProps } from "@calcom/features/ee/organizations/pages/organization";

import PageWrapper from "@components/PageWrapper";

import AddNewTeamsPage, { LayoutWrapper } from "~/settings/organizations/[id]/add-teams-view";

const Page = new Proxy<{
  (): JSX.Element;
  PageWrapper?: typeof PageWrapper;
  getLayout?: typeof LayoutWrapper;
}>(AddNewTeamsPage, {});

Page.getLayout = LayoutWrapper;
Page.PageWrapper = PageWrapper;

export default Page;

export { getServerSideProps };
