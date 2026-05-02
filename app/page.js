import { Button } from "@/components/ui/button";
import { Smile } from 'lucide-react';
import { auth, signOut } from "@/lib/schemas/auth"
export default async function Home() {
  const session = await auth()
  return (
    <div className="text-3xl">
      <h1>Dating App</h1>

      <Button variant="primary">
        <Smile />
        Click me
      </Button>
      {session?.user ? (
        <div>
          <p>Welcome {session.user.name}</p>
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
        </div>
      )}
      <Button onClick={
        async () => {
          "use server"
          await signOut()
          redirect("/")
        }
      }>Sign Out</Button>
    </div>
  );
}
