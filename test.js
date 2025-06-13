import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SocketProgramWebsite() {
  const [tab, setTab] = useState("intro");

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Socket Programming Projects</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="intro">Self Introduction</TabsTrigger>
          <TabsTrigger value="program1">Socket Program #1</TabsTrigger>
          <TabsTrigger value="program2">Socket Program #2</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="intro">
          <Card className="mt-4">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">About Me</h2>
              <p>I am a student learning computer networking and socket programming. This website showcases my projects and learning outcomes.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program1">
          <Card className="mt-4">
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Socket Program #1</h2>
              <p>This project includes a client-server program where the client sends arithmetic expressions and the server returns the result.</p>
              <ul className="list-disc list-inside">
                <li>Correct Example: <code>(3+5)/3-7*4</code> → <code>-25.33</code></li>
                <li>Incorrect Example: <code>(2+5?3-7*4</code> → Error message</li>
              </ul>
              <div className="space-y-2">
                <h3 className="font-semibold">Source Code</h3>
                <a href="/socket1/client.c" className="text-blue-600 underline">Download Client.c</a><br />
                <a href="/socket1/server.c" className="text-blue-600 underline">Download Server.c</a>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Input/Output Screenshots</h3>
                <img src="/socket1/input.png" alt="Input" className="rounded border shadow" />
                <img src="/socket1/output.png" alt="Output" className="rounded border shadow" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program2">
          <Card className="mt-4">
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Socket Program #2</h2>
              <p>Local DNS Server with optional upper server for resolving domain names or saving new entries.</p>
              <ul className="list-disc list-inside">
                <li>Example Read: <code>(R, www.google.com)</code> → <code>222.222.22.2</code></li>
                <li>Example Write: <code>(W, www.myhome.com, 111.111.111.22)</code> → saves</li>
                <li>Example Error: <code>(R, www.unknown.com)</code> → error message</li>
              </ul>
              <div className="space-y-2">
                <h3 className="font-semibold">Source Code</h3>
                <a href="/socket2/client.c" className="text-blue-600 underline">Download Client.c</a><br />
                <a href="/socket2/local_dns.c" className="text-blue-600 underline">Download Local DNS.c</a><br />
                <a href="/socket2/upper_dns.c" className="text-blue-600 underline">Download Upper DNS.c (optional)</a>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Input/Output Screenshots</h3>
                <img src="/socket2/input.png" alt="Input" className="rounded border shadow" />
                <img src="/socket2/output.png" alt="Output" className="rounded border shadow" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference">
          <Card className="mt-4">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">References and Learning</h2>
              <p>The following resources were used to understand and implement the programs:</p>
              <ul className="list-disc list-inside">
                <li>ChatGPT explanations for socket APIs</li>
                <li>Beej’s Guide to Network Programming</li>
                <li>Linux man pages: <code>man socket</code>, <code>man bind</code>, etc.</li>
                <li>Basic DNS concepts from Cloudflare and Wikipedia</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}