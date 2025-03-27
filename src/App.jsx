import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import "./App.css";

const pageSize = 20;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#58a6ff",
    },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    text: {
      primary: "#c9d1d9",
    },
  },
});

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [statusFilter, setStatusFilter] = useState("open");

  const handleChange = (event, status) => {
    setStatusFilter(status);
  };

  const fetchIssues = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/facebook/react/issues?page=${page}&per_page=${pageSize}&state=${statusFilter}`
      );
      const data = await res.json();

      if (data.length === 0) setHasMore(false);
      else {
        setIssues((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error getting issues:", error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchIssues();
    }
  };

  useEffect(() => {
    setIssues([]);
    setPage(1);
    setHasMore(true);
    fetchIssues();
  }, [statusFilter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          my={2}
          alignItems={"center"}
        >
          <Typography variant="h6" sx={{ color: "primary.main" }}>
            React Issues
          </Typography>

          <ToggleButtonGroup
            color="primary"
            value={statusFilter}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="open">Open</ToggleButton>
            <ToggleButton value="closed">Closed</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Paper sx={{ borderRadius: 2 }}>
          <List>
            {issues.map((issue) => (
              <ListItem
                className="listItem"
                key={issue.id}
                component="a"
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemText
                  primary={
                    <Stack direction={"row"} spacing={1}>
                      <Typography variant="body1">{issue.title}</Typography>
                      {issue.labels.map((label) => (
                        <Chip
                          key={label.id}
                          label={label.name}
                          variant="outlined"
                          sx={{
                            borderColor: `#${label.color}`,
                            color: `#${label.color}`,
                            fontSize: "0.75rem",
                            height: 24,
                          }}
                        />
                      ))}
                    </Stack>
                  }
                  secondary={`#${issue.number} opened by ${issue.user.login}`}
                  slotProps={{
                    primary: {
                      style: { color: "white", fontWeight: 500 },
                    },
                    secondary: {
                      style: { color: "#8b949e", fontSize: "0.8rem" },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
          {loading && (
            <CircularProgress
              sx={{
                display: "block",
                mx: "auto",
                my: 2,
                color: "primary.main",
              }}
            />
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default IssuesList;
