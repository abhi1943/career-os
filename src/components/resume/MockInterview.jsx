import { useState } from "react";

import { evaluateInterviewAnswer } from "../../services/interviewEvaluator";

function MockInterview({ questions }) {

    const [index, setIndex] = useState(0);

    const [answer, setAnswer] = useState("");

    const [result, setResult] = useState(null);

    if (!questions) return null;

    const current =
        questions.hrQuestions[index];

    return (

        <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">

                AI Mock Interview

            </h2>

            <p className="font-semibold mb-4">

                {current}

            </p>

            <textarea

                rows={8}

                value={answer}

                onChange={(e)=>

                    setAnswer(e.target.value)

                }

                className="w-full border rounded-xl p-4"

            />

            <div className="flex gap-3 mt-5">

                <button

                    onClick={()=>

                        setResult(

                            evaluateInterviewAnswer(

                                current,

                                answer

                            )

                        )

                    }

                    className="bg-blue-600 text-white px-5 py-2 rounded-xl"

                >

                    Evaluate

                </button>

                <button

                    onClick={() => {

                        setAnswer("");

                        setResult(null);

                        setIndex(

                            (index+1) %

                            questions.hrQuestions.length

                        );

                    }}

                    className="bg-green-600 text-white px-5 py-2 rounded-xl"

                >

                    Next Question

                </button>

            </div>

            {

                result && (

                    <div className="mt-8">

                        <h3 className="text-xl font-bold">

                            Score : {result.score}/100

                        </h3>

                        <ul className="list-disc pl-6 mt-3">

                            {

                                result.suggestions.map(

                                    (item,index)=>(

                                        <li key={index}>

                                            {item}

                                        </li>

                                    )

                                )

                            }

                        </ul>

                    </div>

                )

            }

        </div>

    );

}

export default MockInterview;