"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";

const Heading = () => {
  const { t } = useTranslation();
  const { title, description1, description2, enter, login, name }: any =
    t("marketing");
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [constant, setConstant] = useState<{
    title: string;
    description1: string;
    description2: string;
    name: string;
  }>({
    title: "",
    name: "",
    description1: "",
    description2: "",
  });

  useEffect(() => {
    setConstant({
      title,
      description1,
      description2,
      name,
    });
  }, [title, description1, description2, name]);

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        {constant.title} <span className="underline">{constant.name}</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        {constant.description1} <br /> {constant.description2}
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            {enter} <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            {login} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
