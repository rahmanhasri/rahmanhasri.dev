import * as React from 'react';
import { Link, useStaticQuery, graphql, } from 'gatsby';
import { rhythm } from '../utils/typography';

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
  // const data = useStaticQuery(queryGetTitleMetadata);
  // return (
  //   <div>
  //     <title>{pageTitle} | {data.site.siteMetadata.title}</title>
  //     {/* <header className={siteTitle}>{data.site.siteMetadata.title}</header> */}
  //     <nav>
  //       <ul>
  //         <li><Link to="/">Home</Link></li>
  //         {/* <li><Link to="/about">About</Link></li> */}
  //       </ul>
  //     </nav>
  //     <main>
  //       {children}
  //     </main>
  //   </div>
  // )
  
  // const example = (
  //   <div
  //     css={css`
  //       color: var(--textNormal);
  //       padding: ${rhythm(2)} ${rhythm(1)};
  //       margin: 0 auto;
  //       max-width: 680px;
  //       transition: "color 2s ease-out, background 2s ease-out";
  //     `}
  //   >
  //     <header>
  //       <div
  //         css={css`
  //           display: flex;
  //           flex-direction: column;
  //           align-items: center;
  //           margin-bottom: ${rhythm(2)};
  //           @media (min-width: 650px) {
  //             flex-direction: row;
  //             margin-bottom: ${rhythm(1 / 2)};
  //           }
  //         `}
  //       >
  //         <Link
  //           to="/"
  //           css={css`
  //             width: 100%;
  //             margin-bottom: ${rhythm(2)};
  //             text-align: center;
  //             @media (min-width: 650px) {
  //               width: unset;
  //               margin-bottom: 0;
  //               text-align: unset;
  //             }
  //           `}
  //         >
  //           <h2
  //             css={css`
  //               display: inline-block;
  //               font-style: normal;
  //               margin-bottom: 0;
  //               color: var(--websiteTitle);
  //             `}
  //           >
  //             {data.site.siteMetadata.title}
  //           </h2>
  //         </Link>
  //         <nav
  //           css={css`
  //             display: flex;
  //             flex-direction: column;
  //             margin-left: 0;
  //             align-items: center;
  //             @media (min-width: 650px) {
  //               margin-left: auto;
  //               flex-direction: row;
  //             }
  //           `}
  //         >
  //           <MenuLink to="/">About Me</MenuLink>
  //           <MenuLink to="/blog/">Blog</MenuLink>
  //           <MenuLink to="https://registry.jsonresume.org/ArnaudValensi">
  //             Resume
  //           </MenuLink>
  //           <MenuLink to="/contact/">Socials</MenuLink>
  //         </nav>
  //       </div>
  //       <div
  //         css={css`
  //           display: flex;
  //           flex-direction: row-reverse;
  //           margin-bottom: ${rhythm(3)};
  //           justify-content: center;
  //           @media (min-width: 650px) {
  //             justify-content: unset;
  //           }
  //         `}
  //       >
  //         <ClientOnly
  //           css={css`
  //             height: 24px;
  //           `}
  //         >
  //           <DarkModeToggler />
  //         </ClientOnly>
  //       </div>
  //     </header>
  //     <div>{children}</div>
  //   </div>
  // );
// { padding: `${rhythm(2)} ${rhythm(1)}`}
  return (
    <div className="max-w-screen-sm my-0 mx-auto">
      <header>
        {/* media small flex row */}
        <div className="flex-col items-center justify-center">
          <Link to="/"><h2 className="inline-block">Rahman Hasri</h2></Link>
        </div>
      </header>
      {children}
    </div>
  );
}

export default Layout
