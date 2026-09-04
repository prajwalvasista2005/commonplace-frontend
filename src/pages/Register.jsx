import { useState } from "react";

import {
  Link as RouterLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useForm } from "react-hook-form";

import { useTheme } from "@mui/material/styles";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const theme = useTheme();

  const {
    register: registerUser,
    isAuthenticated,
    loading,
    getErrorMessage,
  } = useAuth();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <CircularProgress aria-label="Loading" size={36} />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setSubmitError("");

    try {
      await registerUser(
        data.email.trim(),
        data.password,
        data.username.trim()
      );

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setSubmitError(
        getErrorMessage(
          err,
          "Registration failed. Please try again."
        )
      );
    }
  };

  const autofillStyles = {
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
      caretColor: theme.palette.text.primary,
      borderRadius: "inherit",
    },

    "& input:-webkit-autofill:hover": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    },

    "& input:-webkit-autofill:focus": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    },

    "& input:-webkit-autofill:active": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
      WebkitTextFillColor: `${theme.palette.text.primary} !important`,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: {
          xs: "flex-start",
          sm: "center",
        },
        px: {
          xs: 1.5,
          sm: 3,
        },
        py: {
          xs: 2,
          sm: 4,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            p: {
              xs: 2.25,
              sm: 4,
            },
            borderRadius: {
              xs: 2,
              sm: 2.5,
            },
          }}
        >
          {/* Header */}
          <Stack
            spacing={1}
            alignItems="center"
            sx={{
              mb: {
                xs: 2.75,
                sm: 3.25,
              },
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src="/favicon.svg"
              alt="Commonplace"
              sx={{
                width: {
                  xs: 40,
                  sm: 44,
                },
                height: {
                  xs: 40,
                  sm: 44,
                },
                borderRadius: 1.5,
                mb: 0.5,
              }}
            />

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "1.55rem",
                  sm: "1.8rem",
                },
                lineHeight: 1.2,
              }}
            >
              Create an account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 320,
              }}
            >
              Join Commonplace to share and save ideas
            </Typography>
          </Stack>

          {/* Success */}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 2.5,
                borderRadius: 1.5,
              }}
            >
              Account created successfully. Redirecting to sign in...
            </Alert>
          )}

          {/* Error */}
          {submitError && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 1.5,
              }}
            >
              {submitError}
            </Alert>
          )}

          {/* Registration form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Stack spacing={2}>
              <TextField
                label="Username"
                fullWidth
                autoComplete="username"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                InputProps={{
                  sx: autofillStyles,
                }}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message:
                      "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 30,
                    message:
                      "Username must be under 30 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Only letters, numbers, and underscores are allowed",
                  },
                })}
              />

              <TextField
                label="Email address"
                type="email"
                fullWidth
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                InputProps={{
                  sx: autofillStyles,
                }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="new-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                InputProps={{
                  sx: autofillStyles,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        edge="end"
                        size="small"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 128,
                    message:
                      "Password must be under 128 characters",
                  },
                })}
              />

              <TextField
                label="Confirm password"
                type={
                  showConfirmPassword ? "text" : "password"
                }
                fullWidth
                autoComplete="new-password"
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  sx: autofillStyles,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        edge="end"
                        size="small"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("confirmPassword", {
                  required:
                    "Please confirm your password",
                  validate: (value) =>
                    value === password ||
                    "Passwords do not match",
                })}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting || success}
                endIcon={
                  isSubmitting ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <PersonAddIcon />
                  )
                }
                sx={{
                  minHeight: 48,
                  mt: 0.5,
                  fontWeight: 650,
                }}
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create account"}
              </Button>
            </Stack>
          </Box>

          {/* Login link */}
          <Divider
            sx={{
              my: {
                xs: 2.75,
                sm: 3,
              },
            }}
          />

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{
              lineHeight: 1.6,
            }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{
                fontWeight: 650,
                color: "primary.main",
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Paper>

        {/* Legal footer */}
        <Stack
          direction="row"
          spacing={1.25}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          sx={{
            mt: 2,
            rowGap: 0.5,
            pb: {
              xs: 1,
              sm: 0,
            },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Commonplace
          </Typography>

          <Typography variant="caption" color="text.secondary">
            •
          </Typography>

          <Link
            component={RouterLink}
            to="/terms"
            underline="hover"
            color="text.secondary"
          >
            <Typography variant="caption">
              Terms
            </Typography>
          </Link>

          <Typography variant="caption" color="text.secondary">
            •
          </Typography>

          <Link
            component={RouterLink}
            to="/privacy"
            underline="hover"
            color="text.secondary"
          >
            <Typography variant="caption">
              Privacy
            </Typography>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}