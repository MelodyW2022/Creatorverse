import { useEffect, useState } from 'react';

const EMPTY_VALUES = {
  name: '',
  url: '',
  description: '',
  imageURL: '',
};

function validate(values) {
  const nextErrors = {};

  if (!values.name.trim()) {
    nextErrors.name = 'Name is required.';
  }

  if (!values.url.trim()) {
    nextErrors.url = 'URL is required.';
  }

  if (!values.description.trim()) {
    nextErrors.description = 'Description is required.';
  }

  return nextErrors;
}

function normalize(values) {
  return {
    name: values.name.trim(),
    url: values.url.trim(),
    description: values.description.trim(),
    imageURL: values.imageURL.trim(),
  };
}

export default function CreatorForm({
  title,
  description,
  initialValues = EMPTY_VALUES,
  submitLabel = 'Save creator',
  onSubmit,
}) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
    setErrors({});
    setSubmitError('');
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit(normalize(values));
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : 'Unable to save this creator right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-copy">
        <p className="eyebrow">Creator form</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <form className="creator-form" onSubmit={handleSubmit} noValidate>
        {submitError ? (
          <article className="form-alert" role="alert">
            {submitError}
          </article>
        ) : null}

        <label>
          <span>Name</span>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'creator-form-name-error' : undefined}
            placeholder="Creator name"
          />
          {errors.name ? (
            <span id="creator-form-name-error" className="field-error">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label>
          <span>URL</span>
          <input
            name="url"
            value={values.url}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.url)}
            aria-describedby={errors.url ? 'creator-form-url-error' : undefined}
            placeholder="https://example.com"
          />
          {errors.url ? (
            <span id="creator-form-url-error" className="field-error">
              {errors.url}
            </span>
          ) : null}
        </label>

        <label>
          <span>Description</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            required
            rows="4"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'creator-form-description-error' : undefined}
            placeholder="What they create"
          />
          {errors.description ? (
            <span id="creator-form-description-error" className="field-error">
              {errors.description}
            </span>
          ) : null}
        </label>

        <label>
          <span>Image URL</span>
          <input
            name="imageURL"
            value={values.imageURL}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </form>
    </section>
  );
}
