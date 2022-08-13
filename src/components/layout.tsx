import * as React from 'react';
import { Link, useStaticQuery, graphql, PageProps } from 'gatsby';
import { ReactPropTypes } from 'react';
// import {
//   siteTitle,
// } from './layout.module.css';

type LayoutPropTypes = {
  pageTitle: string,
}

const Layout = ({ pageTitle, children }: React.PropsWithChildren<LayoutPropTypes>) => {
  const queryGetTitleMetadata = graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `
  const data = useStaticQuery(queryGetTitleMetadata);
  return (
    <div>
      <title>{pageTitle} | {data.site.siteMetadata.title}</title>
      {/* <header className={siteTitle}>{data.site.siteMetadata.title}</header> */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {/* <li><Link to="/about">About</Link></li> */}
        </ul>
      </nav>
      <main>
        <h1>{pageTitle}</h1>
        {children}
      </main>
    </div>
  )
}

export default Layout
