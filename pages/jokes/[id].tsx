import Layout from "../../components/Layout";
import { getAllJokesIds, getJokeData } from "../../lib/jokes";
import LargeJoke from "../../components/joke/LargeJoke";
import JokeDesc from "../../components/joke/JokeDesc";
import { db } from "../../firebase";
import { useState, useEffect, ReactNode, ReactElement } from "react";
import { doc, getDoc } from "firebase/firestore";
import CommentForm from "../../components/comment/CommentForm";
import CommentSection from "../../components/comment/CommentSection";
import Modal from "../../components/misc/Modal";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { UserData } from "../../types/firebase-db";
import PurchaseForm from "../../components/misc/PurchaseForm";
import ResetValueForm from "../../components/misc/ResetValueForm";

type JokePageProps = {
  data: {
    id: string;
    comments: string[];
    image: string | null;
    mainText: string | null;
    owner: string;
    punchline: string | null;
    timestamp: string; // Differs from JokeData because Timestamp is not serializable
    title: string;
    value: number;
    approveCount: number;
    approvers: string[];
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
}

function JokePage({ data }: JokePageProps): ReactElement | null {
  const [ownerData, setOwnerData] = useState<UserData | null>(null);
  const [openPurchaseForm, setOpenPurchaseForm] = useState<boolean>(false);
  const [openResetValueForm, setOpenResetValueForm] = useState<boolean>(false);

  const getOwnerData = async (dataOwner: string): Promise<void> => {
    const docSnap = await getDoc(doc(db, "users", dataOwner));
    if (docSnap.exists()) {
      setOwnerData(docSnap.data() as UserData);
    } else {
      console.error("Owner not found in user documents: " + dataOwner);
    }
  };

  useEffect(() => {
    getOwnerData(data.owner);
  }, [data.owner]);

  return (
    <div className="flex-grow flex flex-col items-center overflow-y-auto scrollbar-hide">
      {openPurchaseForm && (
        <Modal>
          <PurchaseForm
            setOpenPurchaseForm={setOpenPurchaseForm}
            jokeId={data.id}
            jokeTitle={data.title}
            jokeValue={data.value}
            jokeOwnerId={ownerData?.id}
            jokeOwnerName={ownerData?.name}
          />
        </Modal>
      )}
      {openResetValueForm && (
        <Modal>
          <ResetValueForm
            setOpenResetValueForm={setOpenResetValueForm}
            jokeId={data.id}
            jokeValue={data.value}
          />
        </Modal>
      )}
      <div className="w-full flex flex-col max-w-lg md:max-w-3xl items-center pt-6">
        <div className="w-full">
          <LargeJoke
            id={data.id}
            title={data.title}
            mainText={data.mainText}
            punchline={data.punchline}
            image={data.image}
            owner={ownerData}
            ownerId={data.owner}
            approveCount={data.approveCount}
            approvers={data.approvers}
            timestamp={data.timestamp}
          />
        </div>
        <div className="w-full">
          <JokeDesc
            owner={ownerData}
            value={data.value}
            setOpenPurchaseForm={setOpenPurchaseForm}
            setOpenResetValueForm={setOpenResetValueForm}
          />
        </div>
      </div>
      <div className="w-full max-w-lg md:max-w-3xl space-y-4 mb-8">
        <CommentForm jokeId={data.id} />
        <CommentSection jokeId={data.id} />
      </div>
    </div>
  );
}

JokePage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllJokesIds();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<JokePageProps, Params> = async ({
  params,
}) => {
  const jokeData = await getJokeData(params!.id);
  // undefined is not serializable
  if (jokeData.image == undefined) {
    jokeData.image = null;
  }
  if (jokeData.comments == undefined) {
    jokeData.comments = [];
  }
  return {
    props: {
      data: {
        ...jokeData,
        timestamp: jokeData.timestamp.toDate().toString(),
      },
    },
  };
};

export default JokePage;
