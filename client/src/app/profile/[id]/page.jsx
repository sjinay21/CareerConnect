"use client";
import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import Advertisement from "@/components/feed/advertisement";
import Card from "@/components/shared/card";
import EditIcon from "@mui/icons-material/Edit";
import Experience from "@/components/profile/experience";
import Textarea from "@/components/ui/textarea";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import { updateUserProfile } from "@/utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [editProfile, setEditProfile] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    summary: "",
    location: "",
    about: "",
    skill: "",
  });

  function openEditModal() {
    setEditData(profile);
    setEditProfile(true);
  }

  async function handleSave() {
    try {
      const res = await updateUserProfile({
        name: editData.name,
        about: editData.about,
        summary: editData.summary,
        location: editData.location,
        skills: editData.skill,
      });
      if (res.ok) {
        setProfile(editData);
        setEditProfile(false);
        showSuccessToast(TOAST_MESSAGES.PROFILE_UPDATED);
      } else {
        showErrorToast(TOAST_MESSAGES.PROFILE_UPDATE_ERROR);
      }
    } catch (err) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  return (
    <div className="w-full flex flex-col px-3 xl:px-5 py-5 bg-gray-100">
      <div className="flex justify-between">
        <div className="w-full md:w-[70%]">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-[200px]">
                  <div
                    onClick={openEditModal}
                    className="absolute top-3 right-3 z-20 w-[35px] h-[35px] rounded-full bg-white flex justify-center items-center cursor-pointer"
                  >
                    <EditIcon />
                  </div>
                  <img
                    src="/images.jpg"
                    alt="cover"
                    className="w-full h-[200px] rounded-tr-lg rounded-tl-lg"
                  />
                  <div className="absolute object-cover top-36 left-6 z-10">
                    <img
                      src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                      alt="profile"
                      className="rounded-full border-2 h-20 w-20 border-white cursor-pointer"
                    />
                  </div>
                </div>
                <div className="mt-10 relative px-8 py-2">
                  <div
                    onClick={openEditModal}
                    className="absolute top-0 right-3 z-20 w-[35px] h-[35px] rounded-full bg-white flex justify-center items-center cursor-pointer"
                  >
                    <EditIcon />
                  </div>
                  <div className="w-full">
                    <div className="text-2xl">{profile.name}</div>
                    <div className="text-gray-700">{profile.summary}</div>
                    <div className="text-sm text-gray-500">
                      {profile.location}
                    </div>
                    <div className="text-md text-blue-500 w-fit cursor-pointer hover:underline">
                      2 Connection
                    </div>
                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-5">
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Open to
                        </div>
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Share
                        </div>
                      </div>
                      <div className="my-5 flex gap-5">
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Message
                        </div>
                        <div className="cursor-pointer p-2 border rounded-lg hover:bg-blue-600 hover:text-white font-semibold">
                          Connect
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="my-5">
            <Card padding={1}>
              <div className="flex items-center justify-between">
                <div className="text-xl">About</div>
                <div onClick={openEditModal} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
              <div className="text-gray-700 text-md w-[80%]">
                {profile.about}
              </div>
            </Card>
          </div>
          <div className="my-5">
            <Card padding={1}>
              <div className="flex items-center justify-between">
                <div className="text-xl">Skill</div>
                <div onClick={openEditModal} className="cursor-pointer">
                  <EditIcon />
                </div>
              </div>
                  <div className="text-gray-700 text-md w-[80%]">
                {profile.skill}
              </div>
            </Card>
          </div>

          <Experience />
        </div>

        <div className="hidden md:flex md:w-[28%]">
          <div className="my-5 sticky top-19">
            <Advertisement />
          </div>
        </div>
      </div>

      {editProfile && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto rounded-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="text-2xl font-semibold">Edit Profile</div>
              <div
                onClick={() => setEditProfile(false)}
                className="text-3xl cursor-pointer"
              >
                ×
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <Input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
                variant="outline"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Summary</label>
              <Input
                type="text"
                value={editData.summary}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    summary: e.target.value,
                  })
                }
                variant="outline"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold">Location</label>
              <Input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    location: e.target.value,
                  })
                }
                variant="outline"/>
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-semibold">About</label>
              <Textarea
                value={editData.about}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    about: e.target.value,
                  })
                }
                rows="5"
                variant="default"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-1 font-semibold">Skill</label>
              <Textarea
                value={editData.skill}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    skill: e.target.value,
                  })
                }
                rows="5"
                variant="default"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Buttonvariants
                onClick={() => setEditProfile(false)}
                variant="cancel"
              >
                Cancel
              </Buttonvariants>

              <Buttonvariants
                onClick={handleSave}
                variant="psend"
              >
                Save
              </Buttonvariants>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WrappedProfilePage() {
  return <PrivateRoute><ProfilePage /></PrivateRoute>;
}
