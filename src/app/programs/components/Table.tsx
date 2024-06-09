import { getProgramsAndParticipants } from "@/data/programs";
import TableCell from "./TableCell";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";

// 各列のヘッダーとプロパティ名のマッピング
const columns = [
  { header: "フリガナ", property: "ruby" },
  { header: "企画名", property: "name" },
  { header: "キャッチフレーズ", property: "catchphrase" },
  { header: "企画内容", property: "details" },
  { header: "撮影可否", property: "isPhotographable" },
  { header: "SNSアカウント", property: "channel" },
  { header: "ジャンル", property: "genre" },
  { header: "実施日", property: "eventDate" },
  { header: "実施場所", property: "venue" },
  { header: "開始時間", property: "startHour" },
  { header: "終了時間", property: "endHour" },
  { header: "イメージ図", property: "image" }
];

export default async function Table() {
  const { programs, participants } = await getProgramsAndParticipants();

  // 参加者のIDをキーとして参加者名を取得するMapを作成
  const participantsMap = new Map<string, string>();
  participants.forEach((participant) => {
    participantsMap.set(participant.id, participant.name || 'Unknown');
  });

  return (
    <form className="flex w-full mx-auto overflow-x-auto border-l border-t">
      <TableColumn className="border-r-2">
        <TableHeader>団体名</TableHeader>
        {programs.map((program) => {
          const participantName = participantsMap.get(program.participantId || '') || 'Unknown';
          return <TableCell key={program.id} headerName="name" programId={program.id}>{participantName}</TableCell>;
        })}
      </TableColumn>
      <div className="flex overflow-x-auto">
        {columns.map((col, colIdx) => (
          <TableColumn key={colIdx}>
            <TableHeader>{col.header}</TableHeader>
            {programs.map((program) => {
              let cellContent: React.ReactNode;
              if (col.property === "startHour") {
                cellContent = `${program.startHour || ''}:${program.startMinutes || ''}`;
              } else if (col.property === "endHour") {
                cellContent = `${program.endHour || ''}:${program.endMinutes || ''}`;
              } else {
                cellContent = program[col.property as keyof Program] || '';
              }
              return (
                <TableCell key={program.id + col.property} headerName={col.property} programId={program.id}>
                  {cellContent}
                </TableCell>
              );
            })}
          </TableColumn>
        ))}
      </div>
    </form>
  );
}
