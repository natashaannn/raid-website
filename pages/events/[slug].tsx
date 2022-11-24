import { primary } from "@afnexus/hummingbird-ui-assets";
import {
  Heading,
  Tag,
  Box,
  Button,
  Text,
  Container,
  Avatar,
  Divider,
  CSSReset,
  Stack
} from "@chakra-ui/react";
import fs from "fs";
import matter from "gray-matter";
import md from "markdown-it";
import { useMemo } from "react";
import { EventData } from "../../features/events/types";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { useRouter } from "next/router";

export type EventPostPageProps = { frontmatter: EventData; content: string };

export default function BlogPostPage(props: EventPostPageProps) {
  const router = useRouter();
  const { id, date, title, description, tags, location, url } = props.frontmatter;
  const tagsAsArray = useMemo(() => {
    if (!tags) return [];
    return tags.split(", ");
  }, [tags]);

  return (
    <Box minH="100vh" p={3} pt={20}>
      <CSSReset />
      <Container
        maxW="container.lg"
        p={10}
        background={primary[800]}
        rounded="xl"
      >
        <Stack direction="row">

        </Stack>
        <Stack>
        {title && (
          <Heading size="lg" color={primary[50]}>
            {title}
          </Heading>
        )}
        {description && <Text>{description}</Text>}
        {tags && (
          <Box mt={3}>
            {tagsAsArray.map((tag, i) => (
              <Tag key={i} mr={2} mb={2}>
                {tag}
              </Tag>
            ))}
          </Box>
        )}
        {location && date && (
          <Box mt={3} display="flex" alignItems="center" gap={3}>
            <Text>
              At <b>{location}</b> on <b>{date}</b>
            </Text>
          </Box>
        )}
        </Stack>
        {
          url && (<Box padding={4}><Button width="100%" onClick={() => router.push(url)}>Register Here</Button></Box>)
        }

        <Divider mt={3} />
        <Prose>
          <Box
            mt={5}
            dangerouslySetInnerHTML={{ __html: md().render(props.content) }}
          />
        </Prose>
      </Container>
    </Box>
  );
}

// Generating the paths for each post
export async function getStaticPaths() {
  // Get list of all files from our events directory
  const files = fs.readdirSync("content/events");
  // Generate a path for each one
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));
  // return list of paths
  return {
    paths,
    fallback: false,
  };
}

// Generate the static props for the page
export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const fileName = fs.readFileSync(`content/events/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}