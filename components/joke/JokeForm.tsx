import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  AnnotationIcon,
  EmojiHappyIcon,
  PhotographIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import React, { ReactElement, useRef, useState } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import unauthenticatedUser from "../../public/unauthenticated-user.png";
import Spinner from "../misc/Spinner";

function JokeForm(): ReactElement | null {
  const { data: session } = useSession();
  const [mainTextActive, setMainTextActive] = useState<boolean>(true);
  const [punchlineActive, setPunchlineActive] = useState<boolean>(false);
  const [imageActive, setImageActive] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [mainText, setMainText] = useState<string>("");
  const [punchline, setPunchline] = useState<string>("");
  const [value, setValue] = useState<string>("0");
  const imageLoaderRef = useRef<HTMLInputElement>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    if (session) {
      try {
        // Add the joke to "jokes" collection
        const docRef = await addDoc(collection(db, "jokes"), {
          title: title,
          mainText: mainText == "" ? null : mainText,
          punchline: punchline == "" ? null : punchline,
          owner: session.user.id,
          timestamp: serverTimestamp(),
          approveCount: 0,
          approvers: [],
          value: parseInt(value),
        }).then(async (document) => {
          if (image) {
            const storageRef = ref(storage, `jokes/${document.id}`);
            const uploadTask = uploadString(storageRef, image as string, "data_url");
            uploadTask
              .then(() => {
                getDownloadURL(storageRef).then(async (url) => {
                  await setDoc(
                    doc(db, "jokes", document.id),
                    {
                      image: url,
                    },
                    { merge: true }
                  );
                });
              })
              .catch((e) => {
                console.error("Error uploading image: ", e);
              });
          }

          // Append the joke ID to user's document
          await updateDoc(doc(db, "users", session.user.id), {
            jokes: arrayUnion(document.id),
          });

          console.log("Document written with ID: ", document.id);
        });
        resetForm();
      } catch (e) {
        console.log("Error adding document: ", e);
      }
    } else {
      console.error("No session found.");
    }
  };

  const addImageToJoke = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target) {
        setImage(readerEvent.target.result as string);
      }
    };
  };

  const removeImage = () => {
    setImage(null);
  };

  const resetForm = () => {
    setMainTextActive(true);
    setPunchlineActive(false);
    setImageActive(false);
    setTitle("");
    setMainText("");
    setPunchline("");
    setImage(null);
    setValue("0");
    setIsPublishing(false);
  };

  return (
    <div className="p-4 bg-white shadow-md border border-gray-300">
      {isPublishing ? (
        <div className="flex flex-col h-72 md:h-96 justify-center items-center">
          <Spinner />
          <span className="font-light text-xl">
            publishing to joke market...
          </span>
        </div>
      ) : (
        <>
          {/* Top row: User Image, Publish joke... */}
          <div className="flex items-center space-x-2">
            <span className="font-light text-sm mr-2">publish as </span>
            <Image
              className="rounded-full"
              src={session ? session.user.image : unauthenticatedUser}
              alt="User Image"
              width="20"
              height="20"
              layout="fixed"
            />
            <span className="font-semibold text-sm">{session?.user.name}</span>
          </div>
          <hr className="my-3"></hr>

          <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
            {/* Joke Title */}
            <input
              type="text"
              placeholder="Title"
              className="border border-gray-300 focus:border-gray-600 p-2 focus:outline-none"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
            <div className="grid grid-cols-3 space-x-1">
              {mainTextActive ? (
                <div
                  className="joke-feature hover-effect"
                  onClick={() => {
                    setMainTextActive(!mainTextActive);
                  }}
                >
                  <AnnotationIcon className="h-7 text-blue-600" />
                  <p className="text-xs sm:text-sm text-blue-800">Main text</p>
                </div>
              ) : (
                <div
                  className="joke-feature hover-effect"
                  onClick={() => {
                    setMainTextActive(!mainTextActive);
                  }}
                >
                  <AnnotationIcon className="h-7 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">Main text</p>
                </div>
              )}
              {punchlineActive ? (
                <div
                  className="joke-feature hover-effect"
                  onClick={() => {
                    setPunchlineActive(!punchlineActive);
                  }}
                >
                  <EmojiHappyIcon className="h-7 text-red-600" />
                  <p className="text-xs sm:text-sm text-red-800">Punchline</p>
                </div>
              ) : (
                <div
                  className="joke-feature hover-effect"
                  onClick={() => {
                    setPunchlineActive(!punchlineActive);
                  }}
                >
                  <EmojiHappyIcon className="h-7 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">Punchline</p>
                </div>
              )}
              {imageActive ? (
                <div
                  className="joke-feature hover-effect"
                  onClick={() => {
                    setImageActive(!imageActive);
                  }}
                >
                  <PhotographIcon className="h-7 text-green-600" />
                  <p className="text-xs sm:text-sm text-green-800">Image</p>
                </div>
              ) : (
                <div
                  className="joke-feature hover-effect"
                  onClick={() => {
                    setImageActive(!imageActive);
                  }}
                >
                  <PhotographIcon className="h-7 text-gray-400" />
                  <p className="text-xs sm:text-sm text-gray-600">Image</p>
                </div>
              )}
            </div>

            {mainTextActive && (
              <div className="flex flex-col">
                <textarea
                  placeholder="Main text"
                  className="h-60 border border-blue-300 focus:border-blue-600 p-2 focus:outline-none resize-none"
                  value={mainText}
                  onChange={(e) => {
                    setMainText(e.target.value);
                  }}
                ></textarea>
              </div>
            )}
            {punchlineActive && (
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Punchline"
                  value={punchline}
                  onChange={(e) => {
                    setPunchline(e.target.value);
                  }}
                  className="border border-red-300 focus:border-red-600 p-2 focus:outline-none"
                ></input>
              </div>
            )}
            {imageActive &&
              (image ? (
                <div
                  onClick={removeImage}
                  className="h-32 flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
                >
                  <Image
                    className="h-full object-contain"
                    src={image}
                    alt="Image Preview"
                  />
                  <p className="text-xs text-red-500 text-center">
                    click to remove
                  </p>
                </div>
              ) : (
                <div
                  onClick={() => imageLoaderRef.current!.click()}
                  className="h-32 flex items-center space-x-1 hover:bg-gray-100 active:bg-gray-200 flex-grow justify-center p-2 cursor-pointer hover-effect"
                >
                  <PlusIcon className="h-7" />
                  <p className="text-xs sm:text-sm xl:text-base">
                    Add an image
                  </p>
                  <input
                    ref={imageLoaderRef}
                    onChange={addImageToJoke}
                    type="file"
                    hidden
                  />
                </div>
              ))}

            <div className="flex justify-between pt-2">
              <div className="flex justify-center items-center space-x-2">
                <span className="text-sm md:text-base font-light">Value: </span>
                <input
                  type="number"
                  placeholder="50"
                  className="border border-yellow-300 focus:border-yellow-600 w-24 p-2 focus:outline-none font-light"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="space-x-2">
                <button className="bg-gray-200 p-3 text-sm sm:text-base font-semibold hover:bg-gray-300 active:bg-gray-400 hover-effect">
                  save draft
                </button>
                <button
                  type="submit"
                  className="bg-green-200 p-3 text-sm sm:text-base font-semibold hover:bg-green-300 active:bg-green-400 hover-effect"
                >
                  submit
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default JokeForm;
