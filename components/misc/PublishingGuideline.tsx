import { ReactElement } from "react";

function PublishingGuideline(): ReactElement | null {
  return (
    <div className="p-4 bg-white shadow-md border border-gray-300">
      <div className="flex items-center pb-2">
        <span className="font-semibold">joke market guidelines.</span>
      </div>
      <hr></hr>
      <ol className="text-sm flex flex-col space-y-2 pt-2 font-light">
        <li>1. Behave like you would in real life.</li>
        <li>2. While dark or offensive jokes are allowed, they must not incite violence of any kind.</li>
        <li>3. No reposts. Search for duplicates before publishing.</li>
        <li>4. Do not spam or engage in spam-enabling activity of any kind.</li>
        <li>5. Make us laugh!</li>
      </ol>
    </div>
  );
}

export default PublishingGuideline;
