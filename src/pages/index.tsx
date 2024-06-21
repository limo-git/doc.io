import { GetStaticProps } from "next";
import Link from "next/link";
import { getMarkdownFiles } from "../../lib/markdown";

interface HomePageProp {
  files: string[];
}

const HomePage: React.FC<HomePageProp> = ({ files }) => {
  return (
    <div>
      <h1>Markdown Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <Link href={`/${file.replace(".md", "")}`}>{file}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const files = getMarkdownFiles();
  return { props: { files } };
};

export default HomePage;
