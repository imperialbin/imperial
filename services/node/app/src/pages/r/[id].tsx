import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPageContext,
} from "next";
import { useRouter } from "next/router";
import { Component, useEffect, useState } from "react";
import styled from "styled-components";
import Editor from "../../components/Editor";
import Nav from "../../components/Nav";
import { request } from "../../utils/Request";
import { Document as DocumentType } from "../../types";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

class Document extends Component {
  static async getInitialProps(ctx: NextPageContext) {
    if (!ctx.res) return;
    const { query } = ctx;
    const { success, data } = await request<DocumentType>(
      "GET",
      `/document/${query.id}?${query?.password}`,
    );
    ctx.res.setHeader("Content-type", "text/plain");
    ctx.res.write(success && data ? data.content : "An error occurred");
    ctx.res.end();
  }
}

export default Document;
