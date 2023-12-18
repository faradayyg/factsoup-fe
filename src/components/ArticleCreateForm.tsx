import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/custom.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ArticleCreateForm () {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const router = useRouter();
    console.log(API_URL)

    const submitArticle = async (event: FormEvent<HTMLFormElement>) => {
        setSubmitting(true);

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const request = await fetch(
            `${API_URL}/generate-article/`,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: myHeaders
            }
        )
        const response = await request.json()
        setSubmitting(false)

        // redirect to the article page with info from here
        const slug = `${response["token_hash"]}-${response["id"]}`;
        const url =`/article/${slug}/`;
        try{
            router.push(url);
        } catch (err){
            // pass
        }
    }
    return (
        <div className="flex flex-col justify-center">
            <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                {(submitting === true) ? <>
                <svg className="spinner" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
                Please wait, cooking...
                </> :
                <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🧑‍🍳 Cook!
                    </h2>
                    <form className="mt-8 space-y-6" method="POST" action="#" onSubmitCapture={submitArticle}>
                        <div>
                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">The fact</label>
                            <textarea name="text" required id="text" maxLength={150} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Chemicals in the water turn the friggin' the frogs stupid">
                            </textarea>
                        </div>
                        <div>
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                            <input name="date" type="date" id="email" maxLength={150} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="11-12-2003" />
                        </div>
                        <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Cook your article 🍲
                        </button>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-800">
                            For meme purposes only
                        </div>
                    </form>
                </>
                }
            </div>
        </div>
    )
}