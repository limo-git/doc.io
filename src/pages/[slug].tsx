import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { getMarkdownContent, getMarkdownFiles } from "../../lib/markdown";

interface Params extends ParsedUrlQuery {
  slug: string;
}

interface testPageProps {
  content: string;
}

const testPage: React.FC<testPageProps> = ({ content }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = getMarkdownFiles();
  const paths = files.map((file) => ({
    params: { slug: file.replace(".md", "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<testPageProps, Params> = async ({
  params,
}) => {
  const { slug } = params as Params;
  const content = await getMarkdownContent(`${slug}.md`);

  return {
    props: { content },
  };
};

export default testPage;
