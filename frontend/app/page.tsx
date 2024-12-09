import Link from "next/link";
import { redirect } from "next/navigation";

export default function Main() {
  return (
    <div className="px-12 py-8">
      <h1 className="text-2xl font-bold text-indigo-600">
        Web Development Project: NEUSocial
      </h1>
      <h1 className="text-xl font-bold">Team members:</h1>
      <h3>Sanskar Sharma - Section 3</h3>
      <h3>Vishal Rajpurohit - Section 3</h3>
      <h3>Daksh Patel - Section 3</h3>
      <h3>Ashley Tom - Section 3</h3>
      <h1 className="text-xl font-bold mb-2 mt-6">Links:</h1>
      <div>
        <Link
          href={"/home"}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          NEUSocial Web App
        </Link>
      </div>
      <p className="mt-2">
        <a
          href="https://github.com/SharmaSanskar/neu-social-fullstack"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 underline"
        >
          Github Repo
        </a>
      </p>
    </div>
  );
}
