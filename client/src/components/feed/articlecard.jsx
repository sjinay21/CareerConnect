import Card from "@/components/shared/card";
import SocialActions from "@/components/shared/socialactions";

export default function ArticleCard({ article }) {
  return (
    <Card padding={0}>
      <div className="flex gap-3 p-4">
        <div className="w-12 h-12 rounded-4xl">
          <img
            className="rounded-4xl w-12 h-12 border-white cursor-pointer object-cover bg-white"
            src={
              article?.authorProfilePicture ||
              "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
            }
            alt="image"
          />
        </div>

        <div>
          <div className="text-lg font-semibold">user</div>
          <div className="text-xs text-gray-500">user position</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5">
        <div className="text-3xl font-bold mb-4">{article.title}</div>

        <div className="text-lg text-gray-700 whitespace-pre-line">
          {article.content}
        </div>
      </div>

      <SocialActions />
    </Card>
  );
}
