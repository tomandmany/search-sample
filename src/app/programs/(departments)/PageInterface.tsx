import ProgramProvider from "@/app/programs/contexts/ProgramProvider";
import TableRoot from "@/app/programs/_components/Table/TableRoot";
import OpenModalButton from "@/app/programs/_components/Table/Modal/OpenModalButton";
import { getParticipants } from "@/data/participants";
import { getParticipantSocialMedias } from "@/data/participantSocialMedias";

type PageInterfaceProps = {
  programs?: UnionProgram[];
  heading?: string;
  target?: Target;
}

export default async function PageInterface({ programs, heading, target }: PageInterfaceProps) {
  const participants = await getParticipants();
  const participantSocialMedias = await getParticipantSocialMedias();

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        {
          heading && (
            <h1 className="text-lg bg-white shadow-md max-w-fit px-4 py-2 rounded-md">{heading}</h1>
          )
        }
        <OpenModalButton participants={participants} />
      </div>
      <ProgramProvider>
        <TableRoot programs={programs} participants={participants} participantSocialMedias={participantSocialMedias} target={target} />
      </ProgramProvider>
    </>
  )
}