import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import React, { useState } from "react";
import Layout from "../components/Layout";
import ChangeNameForm from "../components/misc/ChangeNameForm";
import DeleteAccountForm from "../components/misc/DeleteAccountForm";
import LoginRedirect from "../components/misc/LoginRedirect";
import Modal from "../components/misc/Modal";

export default function Settings({ session }: { session: Session | any }) {
    const [pressed, setPressed] = useState<string>("account");
    const [openChangeNameForm, setOpenChangeNameForm] = useState<boolean>(false);
    const [openDeleteAccountForm, setOpenDeleteAccountForm] = useState<boolean>(false);

  if (!session) {
    return <LoginRedirect />;
  }

  return (
    <div className="flex-grow h-screen overflow-y-auto scrollbar-hide">
        {openChangeNameForm && (
            <Modal>
                <ChangeNameForm setOpenChangeNameForm={setOpenChangeNameForm} />
            </Modal>
        )}
        {openDeleteAccountForm && (
            <Modal>
                <DeleteAccountForm setOpenDeleteAccountForm={setOpenDeleteAccountForm} />
            </Modal>
        )}
      <div className="mx-auto max-w-md md:max-w-3xl mt-6">
        <div className="flex flex-row items-center">
          <h1 className="font-semibold text-xl md:text-2xl p-6">
            ⚙️ manage your account.
          </h1>
        </div>
        <hr className="py-2 border-gray-300"></hr>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          <div className="col-span-1 flex flex-col pr-2 border-r border-gray-300">
            <button className={`font-semibold hover:bg-gray-300 active:bg-gray-400 hover-effect p-2 rounded-lg ${pressed == "account" && "bg-gray-200"}`} onClick={() => { setPressed("account") }}>Account</button>
            <button className={`font-semibold hover:bg-gray-300 active:bg-gray-400 hover-effect p-2 rounded-lg ${pressed == "balance" && "bg-gray-200"}`} onClick={() => { setPressed("balance") }}>Balance</button>
          </div>
          <div className="col-span-2 md:col-span-3">
            {pressed == "account" && (
                <div>
                    <h1 className="font-semibold text-lg md:text-xl p-2">Change name</h1>
                    <hr></hr>
                    <p className="font-light text-sm md:text-base p-2 mt-2">Changing your name can have unintended side effects.</p>
                    <button className="ml-4 mt-2 border border-gray-400 hover:bg-gray-200 active:bg-gray-300 hover-effect p-2 font-light rounded-lg" onClick={() => setOpenChangeNameForm(true)}>Change name</button>
                    <h1 className="font-semibold text-lg md:text-xl p-2 mt-10 text-red-600">Delete account</h1>
                    <hr></hr>
                    <p className="font-light text-sm md:text-base p-2 mt-2">Once you delete your account, all data will be lost, including your collection of jokes.</p>
                    <button className="ml-4 mt-2 border border-red-400 hover:bg-red-100 active:bg-red-200 hover-effect p-2 text-red-600 rounded-lg" onClick={() => setOpenDeleteAccountForm(true)}>Delete account</button>
                </div>
            )}
            {pressed == "balance" && (
                <div>
                    <h1 className="font-semibold text-lg md:text-xl p-2">Buy coins</h1>
                    <hr></hr>
                    <p className="font-light text-sm md:text-base p-2 mt-2 flex space-x-2">
                    <span>Buying more coins is currently unavailable.</span>
                    </p>
                </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}

Settings.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};
