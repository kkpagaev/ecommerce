"use client";

import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

function WS() {
  const [post, setPost] = useState({
    title: "",
  });
  const [title, setTitle] = useState("");
  const mut = trpc.web.catalog.post.add.useMutation();

  trpc.web.catalog.post.onAdd.useSubscription(undefined, {
    onData(post) {
      setPost(post);
    },
  });

  return (
    <div>
      Res: {post.title}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await mut.mutateAsync({
            title: title,
          });
        }}
      >
        <Input
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default trpc.withTRPC(WS);
