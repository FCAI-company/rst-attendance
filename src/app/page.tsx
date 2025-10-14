import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import Image from "next/image";
import { UserCog, UserCheck } from "lucide-react";
import { InstructorSetupScreen } from "@/Components/InstructorSetupScreen";
import { StudentCheckInScreen } from "@/Components/StudentCheckInScreen";
import Footer from "@/Components/Layout/Footer";
import Header from "@/Components/Layout/Header";
export default function Home() {
  return (
  
      <main className="flex justify-center  px-4 py-8">
        <Tabs defaultValue="instructor" className="w-full">
          {/* <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 mb-8">
            <TabsTrigger value="instructor" className="gap-2">
              <UserCog className="w-4 h-4" />
              Instructor
            </TabsTrigger>
            <TabsTrigger value="student" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Student
            </TabsTrigger>
          </TabsList> */}

          <TabsContent value="instructor" className="mt-0">
            <InstructorSetupScreen />
          </TabsContent>

          <TabsContent value="student" className="mt-0">
            <StudentCheckInScreen />
          </TabsContent>
        </Tabs>
      </main>

     
     
   );
}
