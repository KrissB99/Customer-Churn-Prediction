"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  tenure: number;
  monthlyCharges: number;
  contractType: string;
  internetService: string;
}

interface PredictionResult {
  probability: number;
}

export default function ChurnForm() {
  const [formData, setFormData] = useState<FormData>({
    tenure: 0,
    monthlyCharges: 0,
    contractType: "Month-to-month",
    internetService: "Fiber optic",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "tenure" || name === "monthlyCharges"
          ? Number.parseFloat(value)
          : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      setPrediction(data.probability);
    } catch (err) {
      setError(
        "Failed to get prediction. Please check if the API server is running."
      );
      console.error("Error submitting form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isLikelyToChurn = prediction !== null && prediction > 0.5;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Customer Churn Prediction</CardTitle>
        <CardDescription>
          Enter customer data to predict churn probability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (months)</Label>
            <Input
              id="tenure"
              name="tenure"
              type="number"
              min="0"
              step="1"
              value={formData.tenure.toString()}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyCharges">Monthly Charges ($)</Label>
            <Input
              id="monthlyCharges"
              name="monthlyCharges"
              type="number"
              min="0"
              step="0.01"
              value={formData.monthlyCharges.toString()}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType">Contract Type</Label>
            <Select
              value={formData.contractType}
              onValueChange={(value) =>
                handleSelectChange("contractType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                <SelectItem value="One year">One year</SelectItem>
                <SelectItem value="Two year">Two year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="internetService">Internet Service</Label>
            <Select
              value={formData.internetService}
              onValueChange={(value) =>
                handleSelectChange("internetService", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select internet service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DSL">DSL</SelectItem>
                <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Churn"
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {prediction !== null && !error && (
          <div
            className={`mt-6 p-4 rounded-md ${
              isLikelyToChurn ? "bg-amber-50" : "bg-green-50"
            }`}
          >
            <div className="flex items-center mb-2">
              {isLikelyToChurn ? (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="font-medium text-amber-700">
                    Likely to churn
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium text-green-700">
                    Unlikely to churn
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-700">
              Churn probability:{" "}
              <span className="font-bold">
                {(prediction * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
