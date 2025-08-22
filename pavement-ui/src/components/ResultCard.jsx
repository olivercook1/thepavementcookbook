import {
  Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import PavementSchematic from "./PavementSchematic";

export default function ResultCard({ result, layers, totalDisplay }) {
  if (!result) return null;

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Design Summary</Typography>
          {result.recommendedStructure && (
            <Typography sx={{ mb: 1 }}><strong>Structure:</strong> {result.recommendedStructure}</Typography>
          )}
          {totalDisplay != null && (
            <Typography sx={{ mb: 1 }}><strong>Total thickness (mm):</strong> {totalDisplay}</Typography>
          )}
          {result.clauseReference && (
            <Typography sx={{ mb: 1 }}><strong>Clause reference:</strong> {result.clauseReference}</Typography>
          )}
        </CardContent>
      </Card>

      {layers?.length > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Layer Breakdown</Typography>
            <Table size="small" sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Layer</TableCell>
                  <TableCell align="right">Thickness (mm)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {layers.map((l, i) => (
                  <TableRow key={`${l.name}-${i}`}>
                    <TableCell>{l.name}</TableCell>
                    <TableCell align="right">{l.thickness ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PavementSchematic layers={layers} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
