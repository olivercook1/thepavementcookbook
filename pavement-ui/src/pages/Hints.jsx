import { useState } from "react";
import {
  Card, CardContent, Button, Typography, List, ListItem, ListItemText, Divider
} from "@mui/material";
import { getHints } from "../api/designService";

export default function Hints() {
  const [hints, setHints] = useState(null);

  async function fetchHints() {
    try {
      const data = await getHints();
      setHints(data);
    } catch (err) {
      console.error(err);
      setHints({ error: "Failed to fetch hints" });
    }
  }

  return (
    <Card>
      <CardContent>
        <Button variant="contained" onClick={fetchHints}>Get Design Hints</Button>
        {hints && (
          Array.isArray(hints) ? (
            <List sx={{ mt: 2 }}>
              {hints.map((item, idx) => (
                <div key={idx}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={item?.title || item?.name || `Hint ${idx + 1}`}
                      secondary={
                        typeof item === "string"
                          ? item
                          : typeof item === "object"
                          ? Object.entries(item).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`).join("\n")
                          : String(item)
                      }
                      slotProps={{ component: "pre", sx: { whiteSpace: "pre-wrap", m: 0 } }}
                    />
                  </ListItem>
                  {idx < hints.length - 1 && <Divider component="li" />}
                </div>
              ))}
            </List>
          ) : (
            <List sx={{ mt: 2 }}>
              {Object.entries(hints).map(([k, v]) => (
                <div key={k}>
                  <ListItem>
                    <ListItemText
                      primary={k}
                      secondary={
                        Array.isArray(v)
                          ? v.join(", ")
                          : typeof v === "object"
                          ? JSON.stringify(v, null, 2)
                          : String(v)
                      }
                      slotProps={{ component: "pre", sx: { whiteSpace: "pre-wrap", m: 0 } }}
                    />
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))}
            </List>
          )
        )}
      </CardContent>
    </Card>
  );
}
