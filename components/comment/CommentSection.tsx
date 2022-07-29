import { AnnotationIcon } from "@heroicons/react/outline";
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { db } from "../../firebase";
import EnclosingHeader from "../misc/EnclosingHeader";

type CommentSectionProps = {
  jokeId: string;
};

const CommentSection = ({
  jokeId,
}: CommentSectionProps): ReactElement | null => {
  const [sectionState, setSectionState] = useState<string>("loading");
  const [comments, setComments] = useState<DocumentData[] | null>(null);
  const router = useRouter();

  const fetchComments = async (): Promise<DocumentData[]> => {
    const fetchedComments: DocumentData[] = [];
    const q = query(
      collection(db, "jokes", jokeId, "comments"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      fetchedComments.push(doc.data());
    });
    return fetchedComments;
  };

  useEffect(() => {
    fetchComments().then((comments) => {
      setComments(comments);
      if (comments.length <= 0) {
        setSectionState("no_comments");
      } else {
        setSectionState("fetched");
      }
    });
  }, []);

  return (
    <>
      {sectionState == "loading" && (
        <EnclosingHeader HeaderIcon={AnnotationIcon} headerText="comments">
          <div className="h-60 md:h-72 flex items-center justify-center">
            <span className="font-light text-xl md:text-2xl">
              Loading comments...
            </span>
          </div>
        </EnclosingHeader>
      )}
      {sectionState == "no_comments" && (
        <EnclosingHeader HeaderIcon={AnnotationIcon} headerText="comments">
          <div className="h-60 md:h-72 flex items-center justify-center">
            <span className="font-light text-xl md:text-2xl">
              Be the first to comment on this joke!
            </span>
          </div>
        </EnclosingHeader>
      )}
      {sectionState == "fetched" && (
        <EnclosingHeader
          HeaderIcon={AnnotationIcon}
          headerText={`comments (${comments?.length})`}
        >
          <div className="min-h-[15rem] md:min-h-[18rem] flex flex-col items-center pt-4 space-y-4">
            {comments?.map((data, i) => (
              <div className="flex w-full" key={i}>
                <div className="p-2 border-r-4 border-blue-400">
                  {data.commenterImage && (
                    <Image
                      className="rounded-full"
                      src={data.commenterImage}
                      width="25"
                      height="25"
                      layout="fixed"
                    />
                  )}
                </div>
                <div className="pl-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="hover:underline font-semibold text-sm"
                      onClick={() => {
                        router.push(`/users/${data.commenter}`);
                      }}
                    >
                      {data.commenterName}
                    </span>
                    <span className="font-light">|</span>
                    <span className="font-light text-sm">
                      {moment(data.timestamp.toDate()).fromNow()}
                    </span>
                  </div>
                  <span>{data.comment}</span>
                </div>
              </div>
            ))}
          </div>
        </EnclosingHeader>
      )}
    </>
  );
};

export default CommentSection;
