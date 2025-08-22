import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";
import { liveObject } from "@/modules/live/hooks/types";
import { useLive } from "@/modules/live/hooks/useLive";
import { useUser } from "@/modules/users/hooks/useUser";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/shared/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { CircleStop, Eye } from "lucide-react";
import { NotLive } from "../notLive/notLive";
import { PlayerWithControls } from "../playerLiveWithButtons/playerLiveWithButtons";
import dayjs from "dayjs";
import { Badge } from "@/shared/components/ui/badge";
import { ChatComponent } from "../chatComponent/chatComponent";
import { ProductsSection } from "../productsSection/productsSection";

function LiveIndicator() {
  return (
    <Badge
      variant="outline"
      className="border-red-500 text-red-600 bg-red-100 px-2 py-1 flex items-center gap-2"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
      </span>
      Ao Vivo
    </Badge>
  );
}

export const LiveSection = () => {
  const { user } = useLogin();
  const { liveList } = useLive();

  const { userVinculateLive, getUSerVinculateLive } = useUser();
  const { setOpenDeleteLiveModal, actualLive, setActualLive } = useDashboard();

  const livesAtivas = liveList?.filter((item) => item.status == "live");
  const liveId = actualLive?._id ?? livesAtivas[0]?._id;

  return (
    <Card className="flex-1 shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="w-full flex items-center justify-between">
          <Label className="text-lg font-semibold">
            {user?.userType === "Admin" ? "Lives Ativas" : "Live Ativa"}
          </Label>

          <div className=" flex items-center gap-3">
            {user?.userType === "Admin" && livesAtivas.length > 0 && (
              <Select
                defaultValue={livesAtivas[0]?._id}
                value={actualLive?._id}
                onValueChange={async (e) => {
                  const actualLive = liveList.find((item) => item._id == e);
                  await getUSerVinculateLive(actualLive);
                  setActualLive(actualLive);
                }}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  {livesAtivas.map((item) => (
                    <SelectItem value={item._id}>{item.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {livesAtivas.length > 0 && (
              <Button
                onClick={() => setOpenDeleteLiveModal(true)}
                className="bg-red-500 hover:bg-red-600"
              >
                <CircleStop />
              </Button>
            )}
          </div>
        </div>

        {livesAtivas.length === 0 ? (
          <NotLive />
        ) : (
          <>
            <div
              key={actualLive?._id}
              className="flex justify-between items-center border rounded p-4"
            >
              <div className="w-full  flex items-center gap-4">
                <LiveIndicator />

                <div className="">
                  <h3 className="font-semibold">
                    {actualLive?.title ?? livesAtivas[0]?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {actualLive?.description ?? livesAtivas[0]?.description}
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {dayjs(
                      actualLive?.dayLive?.date ?? livesAtivas[0]?.dayLive?.date
                    ).format("DD/MM/YYYY  HH:mm")}{" "}
                    -{" "}
                    <span className="capitalize">
                      {actualLive?.category ?? livesAtivas[0]?.category}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-gray-700">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">
                    {actualLive?.views ?? liveList[0]?.views ?? 0}
                  </span>
                </div>
              </div>
            </div>
            <section className="flex w-full gap-4">
              <div className="w-6/12 ">
                <PlayerWithControls
                  key={liveId}
                  src={[
                    {
                      src: `https://livepeercdn.studio/hls/${
                        actualLive?.url_play ?? livesAtivas[0]?.url_play
                      }/index.m3u8`,
                      height: 300,
                      mime: "application/mp4",
                      type: "hls",
                      width: 900,
                    },
                  ]}
                />

                <article className="mb-2 mt-5">
                  <div className="flex items-center gap-1 mt-3   ">
                    <Avatar>
                      <AvatarImage
                        src={userVinculateLive?.avatar}
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex ">
                      <span className="font-semibold">
                        {userVinculateLive?.name} -{" "}
                      </span>
                      <Badge
                        className={`${
                          userVinculateLive?.userType === "Admin"
                            ? "border-red-500 text-red-600 bg-red-100 ml-2"
                            : "border-blue-500 text-blue-600 bg-blue-100  ml-2"
                        } px-2 py-1 flex items-center gap-2 '}`}
                      >
                        {userVinculateLive?.userType === "Admin"
                          ? "admin"
                          : "Criador de live"}
                      </Badge>
                    </div>
                  </div>
                </article>
              </div>

              <div className="w-[0.5px] bg-gray-300 max-h-[400px] min-h-[280px]" />
              <ChatComponent liveId={liveId} />
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
};
