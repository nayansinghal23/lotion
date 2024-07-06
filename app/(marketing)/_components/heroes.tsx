import Image from "next/image";
import NotionParade from "@/public/notion-parade.webp";
import NotionParadeLight from "@/public/notion-parade-light.webp";

const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image
            alt="notion-parade"
            src={NotionParade}
            fill
            className="object-contain dark:hidden"
          />
          <Image
            alt="notion-parade-light"
            src={NotionParadeLight}
            fill
            className="object-contain hidden dark:block"
          />
        </div>
      </div>
    </div>
  );
};

export default Heroes;
