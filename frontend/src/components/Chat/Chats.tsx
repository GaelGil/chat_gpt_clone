import { Text, Flex, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { SessionService } from "@/client";
import { useQuery } from "@tanstack/react-query";

function getUsersQueryOptions() {
  return {
    queryFn: () => SessionService.getSessions(),
    queryKey: ["sessions"],
  };
}
const Chats = () => {
  // const sessions;
  const { data, isLoading, isError } = useQuery({
    ...getUsersQueryOptions(),
    placeholderData: (prevData) => prevData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const sessions = data?.sessions ?? [];

  if (sessions.length === 0) {
    return <Text>Start a new chat!</Text>;
  }

  return (
    <Stack>
      {sessions.map((item) => (
        <Flex mb="sm">
          <Link
            to="/chat/$chatId"
            params={{ chatId: item.id.toString() }}
            key={item.id}
          >
            <Text fz={"sm"}>{item.title}</Text>
          </Link>
        </Flex>
      ))}
    </Stack>
  );
};

export default Chats;
