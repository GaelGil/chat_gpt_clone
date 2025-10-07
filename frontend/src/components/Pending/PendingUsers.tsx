"use client";

import { Table } from "@mantine/core";
import { SkeletonText } from "../ui/skeleton";

const PendingUsers = () => (
  <Table striped highlightOnHover withTableBorder withColumnBorders>
    <thead>
      <tr>
        <th style={{ width: "20%" }}>Full name</th>
        <th style={{ width: "25%" }}>Email</th>
        <th style={{ width: "15%" }}>Role</th>
        <th style={{ width: "15%" }}>Status</th>
        <th style={{ width: "25%" }}>Actions</th>
      </tr>
    </thead>

    <tbody>
      {[...Array(5)].map((_, index) => (
        <tr key={index}>
          <td>
            <SkeletonText noOfLines={1} />
          </td>
          <td>
            <SkeletonText noOfLines={1} />
          </td>
          <td>
            <SkeletonText noOfLines={1} />
          </td>
          <td>
            <SkeletonText noOfLines={1} />
          </td>
          <td>
            <SkeletonText noOfLines={1} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default PendingUsers;
