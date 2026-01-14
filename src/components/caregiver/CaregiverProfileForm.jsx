import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";

export const CaregiverProfileForm = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    caregiverCredentials: profile?.caregiverCredentials || "",
    yearsOfExperience: profile?.yearsOfExperience || "",
    certifications: profile?.certifications || "",
    careTypes: profile?.careTypes || "",
    specializations: profile?.specializations || "",
    licenseNumber: profile?.licenseNumber || "",
    licenseExpiry: profile?.licenseExpiry || "",
    employmentStatus: profile?.employmentStatus || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.caregiverCredentials && formData.caregiverCredentials.length > 1000) {
      newErrors.caregiverCredentials = "Credentials cannot exceed 1000 characters";
    }

    if (formData.yearsOfExperience && (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0)) {
      newErrors.yearsOfExperience = "Years of experience must be a positive number";
    }

    if (formData.certifications && formData.certifications.length > 500) {
      newErrors.certifications = "Certifications cannot exceed 500 characters";
    }

    if (formData.careTypes && formData.careTypes.length > 500) {
      newErrors.careTypes = "Care types cannot exceed 500 characters";
    }

    if (formData.specializations && formData.specializations.length > 500) {
      newErrors.specializations = "Specializations cannot exceed 500 characters";
    }

    if (formData.licenseNumber && formData.licenseNumber.length > 100) {
      newErrors.licenseNumber = "License number cannot exceed 100 characters";
    }

    if (formData.employmentStatus && formData.employmentStatus.length > 200) {
      newErrors.employmentStatus = "Employment status cannot exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
        licenseExpiry: formData.licenseExpiry || null,
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-3">Professional Caregiver Information</h4>

      <FormGroup>
        <Label for="caregiverCredentials">Credentials</Label>
        <Input
          type="textarea"
          name="caregiverCredentials"
          id="caregiverCredentials"
          value={formData.caregiverCredentials}
          onChange={handleChange}
          placeholder="e.g., CNA, Home Health Aide, RN"
          rows={3}
          invalid={!!errors.caregiverCredentials}
        />
        {errors.caregiverCredentials && (
          <div className="invalid-feedback d-block">{errors.caregiverCredentials}</div>
        )}
      </FormGroup>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="yearsOfExperience">Years of Experience</Label>
            <Input
              type="number"
              name="yearsOfExperience"
              id="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
              placeholder="Years"
              invalid={!!errors.yearsOfExperience}
            />
            {errors.yearsOfExperience && (
              <div className="invalid-feedback d-block">{errors.yearsOfExperience}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="employmentStatus">Employment Status</Label>
            <Input
              type="text"
              name="employmentStatus"
              id="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
              placeholder="e.g., Self-Employed, Agency: XYZ Care"
              invalid={!!errors.employmentStatus}
            />
            {errors.employmentStatus && (
              <div className="invalid-feedback d-block">{errors.employmentStatus}</div>
            )}
          </FormGroup>
        </Col>
      </Row>

      <FormGroup>
        <Label for="certifications">Certifications</Label>
        <Input
          type="text"
          name="certifications"
          id="certifications"
          value={formData.certifications}
          onChange={handleChange}
          placeholder="e.g., CPR, First Aid, Dementia Care"
          invalid={!!errors.certifications}
        />
        {errors.certifications && (
          <div className="invalid-feedback d-block">{errors.certifications}</div>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="careTypes">Care Types</Label>
        <Input
          type="text"
          name="careTypes"
          id="careTypes"
          value={formData.careTypes}
          onChange={handleChange}
          placeholder="e.g., Elderly, Disability, Post-Surgery"
          invalid={!!errors.careTypes}
        />
        {errors.careTypes && (
          <div className="invalid-feedback d-block">{errors.careTypes}</div>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="specializations">Specializations</Label>
        <Input
          type="text"
          name="specializations"
          id="specializations"
          value={formData.specializations}
          onChange={handleChange}
          placeholder="e.g., Alzheimer's, Mobility Assistance"
          invalid={!!errors.specializations}
        />
        {errors.specializations && (
          <div className="invalid-feedback d-block">{errors.specializations}</div>
        )}
      </FormGroup>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="licenseNumber">License Number</Label>
            <Input
              type="text"
              name="licenseNumber"
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="License number"
              invalid={!!errors.licenseNumber}
            />
            {errors.licenseNumber && (
              <div className="invalid-feedback d-block">{errors.licenseNumber}</div>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="licenseExpiry">License Expiry Date</Label>
            <Input
              type="date"
              name="licenseExpiry"
              id="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
      </Row>

      <div className="mt-4">
        <Button color="primary" type="submit" className="me-2">
          Save Professional Info
        </Button>
        {onCancel && (
          <Button color="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
};
