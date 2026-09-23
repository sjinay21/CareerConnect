"use client";
import { useState } from "react";
import Card from "@/components/shared/card";
import CreateIcon from "@mui/icons-material/Edit";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
export default function Experience() {
  const [editexp, setEditExp] = useState(false);
  const [exp, setExp] = useState({
    title: "Intern",
    start_date: "15/7/2026",
    end_date: "15/10/2026",
    location: "Mumbai",
    company: "Google",
  });

  const [editexpdata, setExpData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    location: "",
    company: "",
  });
  function openEditExp() {
    setExpData(exp);
    setEditExp(true);
  }
  
  return (
        <div className="my-5">
            <Card padding={1}>
          <div className="p-2 border-gray-300 flex justify-between ">
             <div className="text-xl">Experience</div>
             <div onClick={openEditExp} className="cursor-pointer">
              <CreateIcon />
            </div>
             </div>
            <div>
              <div className="text-lg">{exp.title}</div>
              <div className="text-sm">{exp.company}</div>
              <div className="text-sm ">{exp.start_date}</div>
              <div className="text-sm">{exp.end_date}</div>
              <div className="text-sm">{exp.location}</div>
            </div>
             </Card>
        
        {editexp && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
            <div className="bg-white w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto rounded-lg p-6">
              <div className="flex justify-between items-center mb-5">
                <div className="text-2xl font-semibold">Edit Experience</div>
                <div
                  onClick={() => setEditExp(false)}
                  className="text-3xl cursor-pointer"
                >
                  ×
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">Title</label>
                <Input
                  type="text"
                  value={editexpdata.title}
                  onChange={(e) =>
                    setExpData({...editexpdata,title: e.target.value})
                  }
                  variant="outline"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">Company</label>
                <Input
                  type="text"
                  value={editexpdata.company}
                  onChange={(e) =>
                    setExpData({...editexpdata,company: e.target.value})
                  }
                  variant="outline"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-1 font-semibold">Start Date</label>
                <Input 
                type="date"
                  value={editexpdata.start_date}
                  onChange={(e) =>
                    setExpData({
                      ...editexpdata,
                      start_date: e.target.value,
                    })
                  }
                   variant="outline"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-1 font-semibold">End Date</label>
                <Input 
                type="date"
                  value={editexpdata.end_date}
                  onChange={(e) =>
                    setExpData({...editexpdata,end_date: e.target.value})
                  }
                  variant="outline"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Location</label>
                < Input
                  type="text"
                  value={editexpdata.location}
                  onChange={(e) =>
                    setEditExp({ ...editexpdata,location: e.target.value})
                  }
                  variant="outline"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Buttonvariants
                  onClick={() => setEditExp(false)}
                variant="cancel"
                >
                  Cancel
                </Buttonvariants>

                <Buttonvariants
                  onClick={() => {
                    setExp(editexpdata);
                    setEditExp(false);
          
                  }}
                 variant="expsend"
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
