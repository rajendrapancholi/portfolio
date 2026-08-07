import { Blog } from "../models/BlogModel";

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatId = (x: string) => {
  return `...${x.substring(20, 24)}`;
};
export const formatDes = (x: string) => {
  return `${x.substring(0, 40)}....`;
};

export const formatString = (text: string, maxLength: number = 15) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

/**
 * HELPER: Parses Frontmatter
 */
// export function parseMetadata(rawContent: string) {
//   const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
//   let data: any = {};
//   let bodyContent = rawContent;

//   if (match) {
//     const yamlBlock = match[1];
//     bodyContent = match[2];

//     yamlBlock.split("\n").forEach((line) => {
//       const parts = line.split(":");
//       if (parts.length < 2) return;

//       const key = parts[0].trim();
//       let value = parts.slice(1).join(":").trim();

//       // Remove surrounding quotes
//       value = value.replace(/^["'](.+)["']$/, "$1");

//       // Handle Array format: [nextjs, typescript]
//       if (value.startsWith("[") && value.endsWith("]")) {
//         data[key] = value
//           .slice(1, -1)
//           .split(",")
//           .map((item) => item.trim().replace(/^["'](.+)["']$/, "$1"));
//       } else {
//         data[key] = value;
//       }
//     });
//   }

//   return { data, bodyContent };
// }

/**
 * Parses a string containing YAML-like frontmatter and body content.
 *
 * @param {string} rawContent - The raw file content (usually a .md file).
 * @returns {{data: any, content: string}} An object containing the parsed metadata and the remaining body.
 */
export function parseMetadata(rawContent: string): {
  data: any;
  content: string;
} {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  // Add a newline to the end of the block to ensure the regex lookahead matches the last field
  const yamlBlock = match[1] + "\n";
  const bodyContent = match[2];
  const data: Record<string, any> = {};

  // Improved Regex: the lookahead now handles the end of the block more gracefully
  const fieldRegex = /^([a-zA-Z0-9_-]+):\s*([\s\S]*?)(?=\n[a-zA-Z0-9_-]+:|$)/gm;

  let m;
  while ((m = fieldRegex.exec(yamlBlock)) !== null) {
    const key = m[1].trim();
    let value = m[2].trim();

    // Remove outer quotes from the entire value string
    value = value.replace(/^["']([\s\S]*)["']$/, "$1");

    if (key === "author") {
      data[key] = parseAuthorString(value);
    } else if (value.startsWith("[") && value.endsWith("]")) {
      const contentInsideBrackets = value.slice(1, -1);

      // Regex split to ignore commas inside quotes
      const items = contentInsideBrackets.split(
        /,(?=(?:(?:[^"]*"){2})*[^"]*$)/,
      );

      data[key] = items
        .map((item) => {
          let clean = item.trim();
          // Remove inner quotes around individual array items
          return clean.replace(/^["'](.*)["']$/, "$1");
        })
        .filter((item) => item !== "");
    } else {
      data[key] = value;
    }
  }
  return { data, content: bodyContent };
}

/**
 * Helper to turn your custom string into a usable object
 * - Input: "['name': 'Rajendra Pancholi', 'email': '...']"
 * 
 * - Output(json Obj): 
{
  "name": "Rajendra",
  "email": "raj@example.com"
}
 */
function parseAuthorString(str: string) {
  const cleanStr = str.replace(/[\[\]]/g, ""); // Remove brackets
  const obj: any = {};

  // Split by comma to get individual pairs
  const pairs = cleanStr.split(/,(?=(?:(?:[^']*'){2})*[^']*$)/); // Split by comma not inside quotes

  pairs.forEach((pair) => {
    const [aKey, ...aVal] = pair.split(":");
    if (aKey && aVal) {
      const k = aKey.trim().replace(/['"]/g, "");
      const v = aVal.join(":").trim().replace(/['"]/g, "");
      obj[k] = v;
    }
  });
  return obj;
}
